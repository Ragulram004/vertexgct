<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use App\Interfaces\RegistrationRepositoryInterface;
use App\Classes\ApiResponseClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class RegistrationController extends Controller
{
    private RegistrationRepositoryInterface $registrationRepository;


    public function __construct(RegistrationRepositoryInterface $registrationRepository)
    {
        $this->registrationRepository = $registrationRepository;
    }

    /**
     * Store the registration data
     */
    public function store(Request $request)
    {
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'event_id' => 'required|integer|exists:events,id',
            'team_leader_name' => 'required|string|max:255',
            'team_leader_email' => 'required|email|max:255',
            'team_leader_phone' => 'required|string|max:15',
            'team_leader_department' => 'required|string|max:255',
            'team_leader_year' => 'required|integer|in:1,2,3,4',
            'team_leader_college' => 'required|string|max:255',
            'account_holder_name' => 'nullable|string|max:255',
            'team_count' => 'required|integer|min:1',
            'team_name' => 'nullable|string',
            'team_members' => 'nullable|json',
            'transaction_amount' => 'required|numeric|min:0.01',
            'transaction_id' => 'required|string|max:50',
            'proof_of_payment_url' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048', // Validate mandatory image upload
        ]);

        if ($validator->fails()) {
            // Return validation error response using ApiResponseClass
            return ApiResponseClass::sendValidationError(new ValidationException($validator));
        }

        // Validation passed, continue with processing
        $validated = $validator->validated();

         // Retrieve the event ID
        $eventId = $request->event_id;

        // Find the next available application number for this event
        $applicationCount = Registration::where('event_id', $eventId)->count();

        // Generate the application number (incremented from the count)
        $applicationNumber = str_pad($applicationCount + 1, 3, '0', STR_PAD_LEFT); // Padded to 3 digits

        // Generate the application ID (format: VPK + Event ID + Application Number)
        $applicationId = 'VTX' . str_pad($eventId, 2, '0', STR_PAD_LEFT) . $applicationNumber;

        // Handle the payment proof file upload
        $proofOfPaymentUrl = null;
        if ($request->hasFile('proof_of_payment_url') && $request->file('proof_of_payment_url')->isValid()) {
            $file = $request->file('proof_of_payment_url');
            $proofOfPaymentUrl = $file->store('payment_proofs', 'public'); // Store in public disk
        }
        // Generate additional application details
        $applicationDetails = [
            'application_id' => $applicationId, // Generated application ID
            'payment_status' => 'Pending', // Default payment status
            'status' => 'Pending', // Default status
            'arrival_status' => 'Not Verified', // Default arrival status
            'proof_of_payment_url' => $proofOfPaymentUrl, // Store the proof of payment URL
        ];

        // Merge client data with generated application details
        $registrationData = array_merge($validated, $applicationDetails);

        // Begin database transaction
        DB::beginTransaction();
        try {
            // Store the registration data using the repository
            $newRegistration = $this->registrationRepository->store($registrationData);
            DB::commit();

            // Return success response
            return ApiResponseClass::sendResponse($newRegistration,'Registration successful', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponseClass::rollback($e, 'Registration failed');
        }
    }

    public function show($id)
    {
        $register= $this->registrationRepository->getById($id);
        $register->proof_of_payment_url = url('/storage/' . $register->proof_of_payment_url);
        return ApiResponseClass::sendResponse($register, '', 200);
    }

}

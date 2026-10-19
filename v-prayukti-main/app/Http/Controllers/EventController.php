<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Interfaces\EventRepositoryInterface;
use App\Classes\ApiResponseClass;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Termwind\Components\Dd;

class EventController extends Controller
{
    private EventRepositoryInterface $eventRepository;

    public function __construct(EventRepositoryInterface $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }

    public function index()
    {
        $data = $this->eventRepository->index();
        $data->each(function ($event) {
            // Modify or restore the image_url here
            if ($event->image_url) {
                // For example, prepend a base URL
                $event->image_url = url('storage/' . $event->image_url);
            }
        });
        return ApiResponseClass::sendResponse($data, '', 200);
    }

    public function store(StoreEventRequest $request)
    {
        DB::beginTransaction();
        try {
            $event = $this->eventRepository->store($request->all());
            DB::commit();
            return ApiResponseClass::sendResponse($event, 'Event created successfully.', 201);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);
        }
    }

    public function show($id)
    {
        $event = $this->eventRepository->getById($id);
        $event->image_url = url('storage/' . $event->image_url);
        $event->deadline = Carbon::parse($event->deadline)->translatedFormat('jS F Y');
        return ApiResponseClass::sendResponse($event, '', 200);
    }

    public function update(UpdateEventRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $this->eventRepository->update($request->all(), $id);
            DB::commit();
            return ApiResponseClass::sendResponse('Event updated successfully.', '', 200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);
        }
    }

    public function destroy($id)
    {
        $this->eventRepository->delete($id);
        return ApiResponseClass::sendResponse('Event deleted successfully.', '', 204);
    }

    public function combos(){
        $data = $this->eventRepository->combos();
        $data->each(function ($event) {
            if ($event->image_url) {
                $event->image_url = url('storage/' . $event->image_url);
            }
            if ($event->deadline) {
                $event->deadline = Carbon::parse($event->deadline)->translatedFormat('jS F Y');
            }
        });
        return ApiResponseClass::sendResponse($data, '', 200);
    }
}

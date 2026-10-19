<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('registrations', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('application_id')->unique(); // Unique application ID
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade'); // Add the foreign key constraint
            $table->string('team_leader_name'); // Team leader name
            $table->string('team_leader_email'); // Team leader email
            $table->string('team_leader_phone', 15); // Team leader phone number
            $table->string('team_leader_department')->nullable(); // Team leader department
            $table->smallInteger('team_leader_year')->nullable(); // Team leader year
            $table->string('team_leader_college'); // Team leader college
            $table->string('account_holder_name')->nullable(); // Account holder for payments
            $table->string('team_name')->nullable(); // Team name
            $table->smallInteger('team_count')->check('team_count > 0'); // Team count
            $table->jsonb('team_members')->nullable(); // Team members as JSON
            $table->string('ticket_id', 50)->unique()->nullable(); // Ticket ID
            $table->decimal('transaction_amount', 10, 2)->check('transaction_amount > 0'); // Payment amount
            $table->text('proof_of_payment_url')->nullable(); // Payment proof URL
            $table->string('transaction_id', 50); // Transaction ID
            $table->string('payment_status', 50)->default('Pending')->check("payment_status IN ('Pending', 'Completed', 'Failed')"); // Payment status
            $table->text('remark')->nullable(); // Remark for rejected status
            $table->timestamp('registered_at')->useCurrent(); // Registration timestamp
            $table->string('status', 50)->default('Pending')->check("status IN ('Pending', 'Approved', 'Rejected')"); // Registration status
            $table->string('arrival_status', 50)->default('Not Verified')->check("arrival_status IN ('Verified', 'Not Verified')"); // Arrival status
     });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registrations');
    }
};

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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('short_name')->nullable();
            $table->text('image_url')->nullable();
            $table->text('form_url')->nullable();
            $table->enum('type', ['Technical', 'Non Technical', 'Workshops','Hackathons']);
            $table->text('rulebook_url')->nullable();
            $table->text('domain')->nullable();
            $table->text('tag')->nullable();
            $table->string('fee', 50)->nullable();
            $table->date('deadline')->nullable();
            $table->string('team_count', 50)->nullable();
            $table->text('team_formation')->nullable();
            $table->text('problem_url')->nullable();
            $table->text('introduction')->nullable();
            $table->text('description')->nullable();
            $table->text('info')->nullable();
            $table->text('eligibility')->nullable();
            $table->string('faculty_contacts')->nullable();
            $table->string('student_contacts')->nullable();
            $table->string('contact_email')->nullable();
            $table->enum('status', ['Active', 'Inactive'])->default('Active'); // Added status column
            $table->timestamps(); // Automatically adds created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};

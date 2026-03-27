<?php

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('priority')->default(TaskPriority::Medium->value);
            $table->string('status')->default(TaskStatus::Pending->value);
            $table->timestamp('due_date')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->unsignedInteger('order')->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['workspace_id', 'status']);
            $table->index(['workspace_id', 'assigned_to']);
            $table->index(['workspace_id', 'due_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};

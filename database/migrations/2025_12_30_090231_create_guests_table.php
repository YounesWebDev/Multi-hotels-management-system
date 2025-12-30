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
        Schema::create('guests', function (Blueprint $table) {
            $table->id('guest_id');
            $table->unsignedBigInteger('tenant_id');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone',10);
            $table->date('check_in')->nullable();
            $table->date('check_out')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};

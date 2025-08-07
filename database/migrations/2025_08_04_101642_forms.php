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
        //
        Schema::create('forms', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('form_uid')->unique();
            $table->string('name');
            $table->string('description')->nullable();
            $table->boolean('published');
            $table->string('status');
            $table->date('begin_date')->nullable(); //TODO-> remember to remove nullable
            $table->date('end_date')->nullable(); //TODO-> remember to remove nullable
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::dropIfExists('forms');
    }
};

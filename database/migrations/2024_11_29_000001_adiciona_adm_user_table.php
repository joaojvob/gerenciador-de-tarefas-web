<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        // Migration obsoleta — `is_admin` foi removido em favor do sistema de roles
        // por workspace (workspace_members.role). Ver: App\Enums\WorkspaceMemberRole.
    }

    public function down(): void
    {
        //
    }
};

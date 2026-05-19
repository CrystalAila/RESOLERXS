<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function loadUsers(Request $request)
    {
        $search = $request->input('search');

        $users = User::where('is_deleted', false)
            ->orderBy('name', 'asc');

        if ($search) {
            $users->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%");
            });
        }

        $users = $users->paginate(15);

        return response()->json([
            'users' => $users,
        ], 200);
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'max:120'],
            'username' => ['required', 'min:6', 'max:12', Rule::unique('tbl_users', 'username')],
            'password' => ['required', 'min:6', 'max:12', 'confirmed'],
            'password_confirmation' => ['required', 'min:6', 'max:12'],
            'role' => ['required', Rule::in(['admin', 'staff'])],
        ]);

        User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'password' => $validated['password'],
            'role' => $validated['role'],
            'is_deleted' => false,
        ]);

        return response()->json([
            'message' => 'User Successfully Saved.',
        ], 200);
    }

    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'max:120'],
            'username' => ['required', 'min:6', 'max:12', Rule::unique('tbl_users', 'username')->ignore($user->user_id, 'user_id')],
            'password' => ['nullable', 'min:6', 'max:12', 'confirmed'],
            'password_confirmation' => ['nullable', 'min:6', 'max:12'],
            'role' => ['required', Rule::in(['admin', 'staff'])],
        ]);

        $data = [
            'name' => $validated['name'],
            'username' => $validated['username'],
            'role' => $validated['role'],
        ];

        if (! empty($validated['password'])) {
            $data['password'] = $validated['password'];
        }

        $user->update($data);

        return response()->json([
            'message' => 'User Successfully Updated.',
            'user' => $user,
        ], 200);
    }

    public function destroyUser(User $user)
    {
        $user->update(['is_deleted' => true]);

        return response()->json([
            'message' => 'User Successfully Deleted.',
        ], 200);
    }
}

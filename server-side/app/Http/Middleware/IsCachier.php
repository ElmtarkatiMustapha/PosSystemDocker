<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class IsCachier
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $authUser = Auth::user();
        $user = User::find($authUser->id);
        $roles = [];
        foreach ($user->roles as $role) {
            array_push($roles, $role->title);
        }
        if (!empty($user) && (in_array("cachier", $roles) || in_array("admin",$roles) )) {
            return $next($request);
        }
        return response(["message" => "is not cachier"], Response::HTTP_UNAUTHORIZED);
    
    }
}

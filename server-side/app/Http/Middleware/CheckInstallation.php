<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
class CheckInstallation
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
         // Allow install API before installation
        // if (!Config::get('app_installed.installed')) {
        //     if ($request->is('api/install*') || $request->is('api/checkInstall')) {
        //         return $next($request);
        //     }
        //     return response(["message" => "Application not installed yet."], Response::HTTP_FORBIDDEN);
        // }

        // // If already installed, block install endpoints
        // if (Config::get('app_installed.installed') && $request->is('api/install*')) {
        //     return response(["message" => "Application already installed."], Response::HTTP_FORBIDDEN);
        // }

        // return $next($request);
        $path = resource_path('js/settings.json');
        $installed = false;

        // Check if file exists and read installation status
        if (File::exists($path)) {
            $settings = json_decode(File::get($path), true);
            $installed = $settings['installed'] ?? false;
        }

        // Allow access to install and checkInstall endpoints before installation
        if (!$installed) {
            if ($request->is('api/install*') || $request->is('api/checkInstall')) {
                return $next($request);
            }

            return response([
                "message" => "Application not installed yet."
            ], Response::HTTP_FORBIDDEN);
        }

        // Block install endpoints if already installed
        if ($installed && $request->is('api/install*')) {
            return response([
                "message" => "Application already installed."
            ], Response::HTTP_FORBIDDEN);
        }

        // Otherwise continue
        return $next($request);
    }
}

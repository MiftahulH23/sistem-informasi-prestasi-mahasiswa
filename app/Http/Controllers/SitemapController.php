<?php

namespace App\Http\Controllers;

use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class SitemapController extends Controller
{
    public function index()
    {
        Sitemap::create()
            ->add(Url::create('/'))
            ->writeToFile(public_path('sitemap.xml'));

        return response()->file(public_path('sitemap.xml'));
    }
}

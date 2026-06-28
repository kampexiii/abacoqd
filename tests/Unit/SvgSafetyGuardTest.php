<?php

use App\Support\SvgSafetyGuard;

test('acepta un SVG de logo benigno', function () {
    SvgSafetyGuard::ensureSafe('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#000"/></svg>');
})->throwsNoExceptions();

test('acepta un SVG con referencia interna a un símbolo (#fragment)', function () {
    SvgSafetyGuard::ensureSafe('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><symbol id="a"><rect width="1" height="1"/></symbol></defs><use xlink:href="#a"/></svg>');
})->throwsNoExceptions();

test('rechaza un SVG con <script>', function () {
    SvgSafetyGuard::ensureSafe('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
})->throws(InvalidArgumentException::class);

test('rechaza un SVG con manejador onload', function () {
    SvgSafetyGuard::ensureSafe('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><rect width="1" height="1"/></svg>');
})->throws(InvalidArgumentException::class);

test('rechaza un SVG con manejador onerror en un elemento hijo', function () {
    SvgSafetyGuard::ensureSafe('<svg xmlns="http://www.w3.org/2000/svg"><image href="x.png" onerror="alert(1)"/></svg>');
})->throws(InvalidArgumentException::class);

test('rechaza un SVG con esquema javascript: en xlink:href', function () {
    SvgSafetyGuard::ensureSafe('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><a xlink:href="javascript:alert(1)"><rect width="1" height="1"/></a></svg>');
})->throws(InvalidArgumentException::class);

test('rechaza un SVG con referencia externa en href', function () {
    SvgSafetyGuard::ensureSafe('<svg xmlns="http://www.w3.org/2000/svg"><image href="https://evil.example/tracker.png"/></svg>');
})->throws(InvalidArgumentException::class);

test('rechaza un SVG con foreignObject', function () {
    SvgSafetyGuard::ensureSafe('<svg xmlns="http://www.w3.org/2000/svg"><foreignObject><body xmlns="http://www.w3.org/1999/xhtml"><script>alert(1)</script></body></foreignObject></svg>');
})->throws(InvalidArgumentException::class);

test('rechaza un SVG con entidades externas declaradas (XXE)', function () {
    SvgSafetyGuard::ensureSafe('<?xml version="1.0"?><!DOCTYPE svg [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><svg xmlns="http://www.w3.org/2000/svg"><title>&xxe;</title></svg>');
})->throws(InvalidArgumentException::class);

test('rechaza contenido que no es XML válido', function () {
    SvgSafetyGuard::ensureSafe('<svg this is not xml');
})->throws(InvalidArgumentException::class);

test('rechaza contenido cuyo elemento raíz no es <svg>', function () {
    SvgSafetyGuard::ensureSafe('<html><body>not an svg</body></html>');
})->throws(InvalidArgumentException::class);

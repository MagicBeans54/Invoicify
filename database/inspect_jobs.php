<?php

use Illuminate\Support\Facades\DB;

$jobs = DB::table('jobs')->get();
echo 'Jobs in table: ' . $jobs->count() . PHP_EOL;

foreach ($jobs as $job) {
    echo '---' . PHP_EOL;
    echo 'id: ' . $job->id . ' | queue: ' . $job->queue . ' | attempts: ' . $job->attempts . PHP_EOL;
    $payload = json_decode($job->payload, true);
    $displayName = $payload['displayName'] ?? '?';
    echo 'displayName: ' . $displayName . PHP_EOL;
    $data = $payload['data'] ?? [];
    if (isset($data['command'])) {
        $cmd = unserialize($data['command']);
        $obj = $cmd->__construct ?? ($cmd->command ?? null);
        // Print constructor-induced info
        $ref = new ReflectionClass($cmd);
        echo 'command class: ' . $ref->getName() . PHP_EOL;
        foreach ($ref->getProperties() as $prop) {
            if ($prop->isStatic()) { continue; }
            $prop->setAccessible(true);
            $val = $prop->getValue($cmd);
            if ($val instanceof \Illuminate\Mail\Mailable || is_object($val) && !is_string($val) && !is_int($val)) {
                echo '  prop ' . $prop->getName() . ': ' . get_class($val) . PHP_EOL;
            } else {
                $s = (string) $val;
                echo '  prop ' . $prop->getName() . ': ' . (strlen($s) > 60 ? substr($s,0,60).'...' : $s) . PHP_EOL;
            }
        }
    }
}

$failed = DB::table('failed_jobs')->count();
echo PHP_EOL . 'Failed jobs: ' . $failed . PHP_EOL;
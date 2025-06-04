<?php

namespace Modules\User\Console;

use Database\Factories\UserFactory;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class GenerateUsers extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'generate:users';

    /**
     * The console command description.
     */
    protected $description = 'Command description.';

    /**
     * Create a new command instance.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        UserFactory::new()->count(199)->create();
    }

    /**
     * Get the console command arguments.
     */
    protected function getArguments(): array
    {
        return [
            ['example', InputArgument::REQUIRED, 'An example argument.'],
        ];
    }

    /**
     * Get the console command options.
     */
    protected function getOptions(): array
    {
        return [
            ['example', null, InputOption::VALUE_OPTIONAL, 'An example option.', null],
        ];
    }
}

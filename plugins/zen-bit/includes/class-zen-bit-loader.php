<?php
namespace ZenBit;
if (!defined("ABSPATH")) die;
class Zen_BIT_Loader {
    protected array $actions;
    protected array $filters;
    protected array $shortcodes;
    public function __construct() { $this->actions = []; $this->filters = []; $this->shortcodes = []; }
    public function add_action(string $hook, $component, string $callback, int $priority = 10, int $accepted_args = 1): void {
        $this->actions = $this->add($this->actions, $hook, $component, $callback, $priority, $accepted_args);
    }
    public function add_filter(string $hook, $component, string $callback, int $priority = 10, int $accepted_args = 1): void {
        $this->filters = $this->add($this->filters, $hook, $component, $callback, $priority, $accepted_args);
    }
    public function add_shortcode(string $tag, $component, string $callback): void {
        $this->shortcodes[] = ["tag" => $tag, "component" => $component, "callback" => $callback];
    }
    private function add(array $hooks, string $hook, $component, string $callback, int $priority, int $accepted_args): array {
        $hooks[] = ["hook" => $hook, "component" => $component, "callback" => $callback, "priority" => $priority, "accepted_args" => $accepted_args];
        return $hooks;
    }
    public function run(): void {
        foreach ($this->filters as $hook) { \add_filter($hook["hook"], [$hook["component"], $hook["callback"]], $hook["priority"], $hook["accepted_args"]); }
        foreach ($this->actions as $hook) { \add_action($hook["hook"], [$hook["component"], $hook["callback"]], $hook["priority"], $hook["accepted_args"]); }
        foreach ($this->shortcodes as $shortcode) { \add_shortcode($shortcode["tag"], [$shortcode["component"], $shortcode["callback"]]); }
    }
}

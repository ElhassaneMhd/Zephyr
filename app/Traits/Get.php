<?php

namespace App\Traits;

trait Get
{

        protected function getCounters($category, $counter){
            $user = auth()->user();
            $counter = $user->centre->tables->where('category' , $category)->where('counter', $counter) ?? [];
            return $this->refactorManyElements($counter, 'tables');
        }

}

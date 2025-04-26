<?php

namespace App\Traits;

trait Refactor
{
    protected function refactorManyElements($elements, $data)
    {
        foreach ($elements as $element) {
            ($data === 'tables') && $all[$element->table_name][] = $this->refactorTable($element);
            ($data === 'users') && $all[] = $this->refactorUser($element);
            ($data === 'centres') && $all[] = $this->refactorCentre($element);
        }
        return $all ?? [];
    }
    protected function refactorTable($table)
    {
       // dd($table);
        $centre = $table->centre;
        $date = new \DateTime($table->date);

        return [
            'id' => $table->id,
            'name' => $table->name,
            'date' => $date->format('Y-m-dTH:i:s'),
            'index' => $table->index,
            'consummation' => $table->consummation,
            "cos" => $table->cos,
            "puissance" => $table->puissance,
            'centre' => $centre->name,
            'counter' => $table->counter,
            "created_at" => $table->created_at->format('Y-m-dTH:i:s'),
            "updated_at" => $table->updated_at->format('Y-m-dTH:i:s'),
        ];
    }
    protected function refactorUser($user)
    {
        $centre = $user->centre;
        return [
            "id" => $user->id,
            "name" => $user->name,
            "email" => $user->email,
            "role" => $user->role,
            "centre" => $centre ? $this->refactorCentre($centre) : null,
            "created_at" => $user->created_at->format('Y-m-d H:i:s'),
            "updated_at" => $user->updated_at->format('Y-m-d H:i:s'),
        ];
    }
    protected function refactorCentre($centre)
    {
        $centre->load('tables');
        $allUsers = $centre->users;
        foreach ($allUsers as $user) {
            $users[] = [
                "id" => $user->id,
                "name" => $user->name,
                "email" => $user->email,
            ];
        }
        return [
            "id" => $centre->id,
            "name" => $centre->name,
            "created_at" => $centre->created_at,
            "updated_at" => $centre->updated_at,
            "users" => $users ?? [],
            "tables" => $this->refactorManyElements($centre->tables, 'tables'),
        ];
    }
}

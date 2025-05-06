<?php

namespace App\Http\Controllers;

use App\Models\Historic;
use App\Models\Table;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HistoricController extends Controller
{
    public function index($category,$counter, $id)
    {
        $table = Table::findOrFail($id);
        $history = $table->historics;
        $tables = $this->getCounters($category,$counter);
        return Inertia::render(ucfirst($category).'/'.ucfirst($counter), compact('tables', 'history'));
    }

    public function destroy($id)
    {
        $historic = Historic::findOrFail($id);
        $historic->delete();
        return to_route('history', ['counter'=>$historic->table->counter, 'id'=>$historic->table_id]);
    }
}

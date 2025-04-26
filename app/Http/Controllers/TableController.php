<?php

namespace App\Http\Controllers;

use App\Models\Centre;
use App\Models\Table;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TableController extends Controller
{

    public function index()
    {
        $user = auth()->user();
        if ($user->role == 'superAdmin'){
            $centres = Centre::all();
            foreach ($centres as $centre){
                if ($centre->tables->count() !== 0){
                    $tables[$centre->name] = $this->refactorManyElements($centre->tables, 'tables');
                }
            }
        }else{
            $allTables = $user->centre->tables;
            $tables = $this->refactorManyElements($allTables, 'tables');
        }
        return response()->json($tables);
    }

    public function getGenerale()
    {

        $tables = $this->getCounters('general');
        return Inertia::render('Electricite/General',compact('tables'));
    }
    public function getDivisional()
    {
        $tables =$tables = $this->getCounters('divisional');
        return Inertia::render('Electricite/Divisional',compact('tables'));
    }

    public function store(Request $request)
    {
        $centre = $request->user()->centre;
        $data =$request->validate([
            'table_name' => 'required',
            'name' => 'required',
            'date' => 'required',
            'index' => 'required|numeric',
            'consummation' => 'required|numeric',
            'counter' => 'required|in:general,divisional',
        ]);
        if ( $data['counter'] == 'general'){
            $request->validate([
                'cos' => 'required|numeric',
                'puissance' => 'required|numeric',
            ]);
            $data['cos'] = $request->cos;
            $data['puissance'] = $request->puissance;
        }
        $data['centre_id'] = $centre->id;
        Table::create(attributes: $data);
       return redirect('/electricite/'.$request->counter);
    }
    public function update(Request $request, $id)
    {
        $table = Table::findOrFail($id);
        $request->validate([
            'date' => 'required|date',
            'puissance' => 'numeric',
            'consummation' => 'required|numeric',
            "cos" => 'numeric',
        ]);
                $counter = $table->counter;

        $table->update($request->all());
       return redirect('/electricite/'.$counter);
    }
    public function destroy($id)
    {
        $table = Table::findOrFail($id);
        $counter = $table->counter;
        $table->delete();
       return redirect('/electricite/'.$counter);
    }
    public function multipleDestroy(Request $request)
    {
        $ids = $request->ids ??[];
        $table = Table::findOrFail($ids[0]);
        $counter = $table->counter;
        Table::whereIn('id',$ids)->delete();
       return redirect('/electricite/'.$counter);
    }
    public function notFound()
    {
        return Inertia::render('UnderConstruction');
    }
}

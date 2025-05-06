<?php

namespace App\Http\Controllers;

use App\Models\Centre;
use App\Models\Table;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TableController extends Controller
{

    public function getCounter($category,$counter)
    {
        $tables = $this->getCounters($category,$counter);
        $pageTitle = ucfirst($category) . '/' . ucfirst($counter);
        return Inertia::render($pageTitle ,compact('tables'));
    }

    public function store(Request $request,$category)
    {
        $centre = $request->user()->centre;
        $data =$request->validate([
            'table_name' => 'required',
            'name' => 'required',
            'date' => 'required',
            'index' => 'required|numeric',
            'consummation' => 'required|numeric',
            'counter' => 'required|in:general,divisional',
            'centre_id' => 'required|exists:centres,id',
        ]);
        if ( $data['counter'] == 'general' && $category == 'electricite'){
            $request->validate([
                'cos' => 'required|numeric',
                'puissance' => 'required|numeric',
            ]);
            $data['cos'] = $request->cos;
            $data['puissance'] = $request->puissance;
        }
        $data['category'] = $category;
        Table::create(attributes: $data);
       return redirect($category."/".$request->counter);
    }

    public function update(Request $request,$category, $id)
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
       return redirect($category."/".$counter);
    }

    public function destroy($category,$id)
    {
        $table = Table::findOrFail($id);
        $counter = $table->counter;
        $table->delete();
       return redirect($category."/".$counter);
    }

    public function multipleDestroy(Request $request,$category)
    {
        $ids = $request->ids ??[];
        $table = Table::findOrFail($ids[0]);
        $counter = $table->counter;
        Table::whereIn('id',$ids)->delete();
       return redirect($category."/".$counter);
    }
    public function notFound()
    {
        return Inertia::render('UnderConstruction');
    }
}

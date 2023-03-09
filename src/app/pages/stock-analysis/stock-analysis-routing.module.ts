import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { StockAnalysisComponent } from "./stock-analysis.component";

const routes: Routes = [
    {
        path: "",
        component: StockAnalysisComponent
    }
] 

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]

})
export class StockAnalysisRoutingModule {}
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { LayoutModel } from "./layoutModel";
import { ILayoutService, LayoutContract } from "@paperbits/common/layouts";
import { Contract, Bag } from "@paperbits/common";

export class LayoutModelBinder {
    constructor(
        private readonly layoutService: ILayoutService,
        private readonly modelBinderSelector: ModelBinderSelector
    ) { }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "layout";
    }

    public canHandleModel(model: any): boolean {
        return model instanceof LayoutModel;
    }

    public async contractToModel(contract: LayoutContract, bindingContext?: Bag<any>): Promise<LayoutModel> {
        const layoutModel = new LayoutModel();
        layoutModel.key = contract.key;

        const layoutContent = await this.layoutService.getLayoutContent(contract.key);

        const modelPromises = layoutContent.nodes.map(async (contract: Contract) => {
            const modelBinder = this.modelBinderSelector.getModelBinderByContract(contract);
            return await modelBinder.contractToModel(contract, bindingContext);
        });

        const widgetModels = await Promise.all<any>(modelPromises);
        layoutModel.widgets = widgetModels;

        return layoutModel;
    }

    public modelToContract(model: LayoutModel): Contract {
        const contract: Contract = {
            type: "layout",
        };

        return contract;
    }
}
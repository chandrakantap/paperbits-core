import { YoutubePlayerContract } from "./youtubePlayerContract";
import { YoutubePlayerModel } from "./youtubePlayerModel";
import { IModelBinder } from "@paperbits/common/editing";
import { Contract } from "@paperbits/common";

export class YoutubeModelBinder implements IModelBinder<YoutubePlayerModel> {
    constructor() {
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "youtube-player";
    }

    public canHandleModel(model: any): boolean {
        return model instanceof YoutubePlayerModel;
    }

    public async contractToModel(youtubeNode: YoutubePlayerContract): Promise<YoutubePlayerModel> {
        const youtubePlayerModel = new YoutubePlayerModel();

        youtubePlayerModel.videoId = youtubeNode.videoId || youtubeNode["videoKey"];
        youtubePlayerModel.controls = youtubeNode.controls;
        youtubePlayerModel.autoplay = youtubeNode.autoplay;
        youtubePlayerModel.loop = youtubeNode.loop;

        return youtubePlayerModel;
    }

    public modelToContract(youtubeModel: YoutubePlayerModel): YoutubePlayerContract {
        const youtubeConfig: YoutubePlayerContract = {
            type: "youtube-player",
            videoId: youtubeModel.videoId,
            controls: youtubeModel.controls,
            autoplay: youtubeModel.autoplay,
            loop: youtubeModel.loop
        };

        return youtubeConfig;
    }
}
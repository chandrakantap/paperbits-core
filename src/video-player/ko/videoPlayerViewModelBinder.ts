import { VideoPlayerViewModel } from "./videoPlayerViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { VideoPlayerModel } from "../videoPlayerModel";
import { EventManager } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles/styleCompiler";
import { Bag } from "@paperbits/common";
import { IPermalinkResolver } from "@paperbits/common/permalinks";

export class VideoPlayerViewModelBinder implements ViewModelBinder<VideoPlayerModel, VideoPlayerViewModel> {
    constructor(
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler,
        private readonly mediaPermalinkResolver: IPermalinkResolver
    ) { }

    public async modelToViewModel(model: VideoPlayerModel, viewModel?: VideoPlayerViewModel, bindingContext?: Bag<any>): Promise<VideoPlayerViewModel> {
        if (!viewModel) {
            viewModel = new VideoPlayerViewModel();
        }

        let sourceUrl = null;

        if (model.sourceKey) {
            sourceUrl = await this.mediaPermalinkResolver.getUrlByTargetKey(model.sourceKey);

            if (!sourceUrl) {
                console.warn(`Unable to set video. Media with source key ${model.sourceKey} not found.`);
            }
        }

        viewModel.sourceUrl(sourceUrl);
        viewModel.controls(model.controls);
        viewModel.autoplay(model.autoplay);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles));
        }

        viewModel["widgetBinding"] = {
            displayName: "Video player",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            editor: "video-player-editor",
            applyChanges: async (changes) => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: VideoPlayerModel): boolean {
        return model instanceof VideoPlayerModel;
    }
}
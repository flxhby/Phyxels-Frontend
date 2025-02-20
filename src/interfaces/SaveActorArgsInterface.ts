namespace phyxels {
    export type SaveActorArgs = ex.ActorArgs & {
        type: number;
        x?: number;
        y?: number;
    }
}
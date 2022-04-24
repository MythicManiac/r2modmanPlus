import ProviderUtils from '../ProviderUtils';
import R2Error from '../../../model/errors/R2Error';
import Game from '../../../model/game/Game';
import Profile from '../../../model/Profile';

export default abstract class GameRunnerProvider {

    private static provider: () => GameRunnerProvider;
    static provide(provided: () => GameRunnerProvider): void {
        this.provider = provided;
    }

    public static get instance(): GameRunnerProvider {
        if (GameRunnerProvider.provider === undefined) {
            throw ProviderUtils.throwNotProvidedError("GameRunnerProvider");
        }
        return GameRunnerProvider.provider();
    }

    public abstract getGameArguments(game: Game, profile: Profile): Promise<string | R2Error>;
    public abstract startModded(game: Game, profile: Profile): Promise<void | R2Error>;
    public abstract startVanilla(game: Game, profile: Profile): Promise<void | R2Error>;

}

import Entity from 'engine/entities/Entity';
import SpritesManager from 'manager/SpritesManager';
import PlayerComponent from 'components/PlayerComponent';

export default {
    createPlayer(x: number, y: number): Entity {
        let mat = SpritesManager.materials.FIREMAN,
            ret: Entity = new Entity(SpritesManager.getGeometry(mat), mat);

        ret.setPosition(x, y, 0.0);

        ret.addComponent(new PlayerComponent());

        return ret;
    }
};
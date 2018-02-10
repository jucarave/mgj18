import Entity from 'engine/entities/Entity';
import SpritesManager from 'manager/SpritesManager';
import PlayerComponent from 'components/PlayerComponent';
import SpriteMaterial from 'engine/materials/SpriteMaterial';

export default {
    createPlayer(x: number, y: number): Entity {
        let mat = SpritesManager.materials.FIREMAN,
            ret: Entity = new Entity(SpritesManager.getGeometry(mat), mat);

        ret.setPosition(x, y, 0.0);

        ret.addComponent(new PlayerComponent());

        return ret;
    },

    createSearchable(sprite: string, x: number, y: number): Entity {
        let mat = <SpriteMaterial>SpritesManager.materials.HOUSE.clone();
        mat.playAnimation(sprite);
        
        let ret: Entity = new Entity(SpritesManager.getGeometry(mat), mat);

        ret.setPosition(x, y, 0.0);

        return ret;
    }
};
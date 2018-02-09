import Entity from "engine/entities/Entity";
import SpritesManager from "manager/SpritesManager";
import RoomsManager from "manager/RoomsManager";
import Geometry from "engine/geometry/Geometry";
import SpriteMaterial from "engine/materials/SpriteMaterial";

const TILE_WIDTH = 16;
const TILE_HEIGHT = 16;

function addGeometry(geo: Geometry, x: number, y: number, uvs: Array<number>): void {
    let x1 = x * TILE_WIDTH,
        y1 = y * TILE_HEIGHT,
        x2 = x1 + TILE_WIDTH,
        y2 = y1 + TILE_HEIGHT,
        ind = geo.trianglesLength * 2 ;

    geo.addVertice(x1, y2, 0.0);
    geo.addVertice(x2, y2, 0.0);
    geo.addVertice(x1, y1, 0.0);
    geo.addVertice(x2, y1, 0.0);

    geo.addTextureCoord(uvs[0], uvs[3]);
    geo.addTextureCoord(uvs[2], uvs[3]);
    geo.addTextureCoord(uvs[0], uvs[1]);
    geo.addTextureCoord(uvs[2], uvs[1]);

    geo.addTriangle(ind, ind + 1, ind + 2);
    geo.addTriangle(ind + 1, ind + 3, ind + 2);
}

export default {
    createTestRoom(gl: WebGLRenderingContext): Entity {
        let mat = <SpriteMaterial> SpritesManager.materials.HOUSE,
            room = RoomsManager.livingRoom,
            ret: Entity,
            geo = new Geometry(gl);

        let h = room.length,
            w = room[0].length;
        for (let y=0;y<h;y++) {
            for (let x=0;x<w;x++) {
                let tile = room[y][x];
                if (tile == 0) { continue; }

                let tileName = "floor";
                switch (tile) {
                    case 2:
                        tileName = "floorWall";
                        break;

                    case 3:
                        tileName = "wall";
                        break;
                }

                addGeometry(geo, x, y-h, mat.getAnimationUVS(tileName, 0));
            }
        }

        geo.build();

        ret = new Entity(geo, mat);

        return ret;
    }
};
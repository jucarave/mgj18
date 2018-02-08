export default {
    roundUpPowerOf2(number: number): number {
        let ret = 2;
        while (ret < number) {
            ret *= 2;
        }

        return ret;
    }
}
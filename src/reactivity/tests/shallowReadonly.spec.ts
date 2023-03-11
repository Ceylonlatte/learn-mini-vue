import { isReadonly, shallowReadonly } from "../../reactive"

describe('shallowReadonly', ()=> {
    test("should note make non-reactive properties reactive", ()=> {
        const props = shallowReadonly({
            n: {
                foo:1
            }
        })
        expect(isReadonly(props)).toBe(true)
        expect(isReadonly(props.n)).toBe(false)
    })
})
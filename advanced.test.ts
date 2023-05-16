import { match, P } from "ts-pattern";

describe("The good stuff 😎", () => {
    it("P.optional", () => {
        type SomeFormEvent = {
            target?: {
                value?: string[];
            };
        };

        const handleEvent = (event: SomeFormEvent): string | null => {
            // TODO implement
            return null;
        };

        expect(handleEvent({})).toBeNull();
        expect(handleEvent({ target: {} })).toBe("");
        expect(handleEvent({ target: { value: ["a", "b", "c"] } })).toBe(
            "a,b,c"
        );
    });

    it("watch out with matching nullish values", () => {
        // undefined !== undefined 🤔?
        expect(
            match({})
                .with({ value: P.nullish }, () => "value is nullish")
                .otherwise(() => null)
        ).toBe("value is nullish");
    });

    it("Tuples!", () => {
        const joinArray = (arr: Array<string | number>): string => arr.join("");
        const matchArray = (arr: Array<string | number>): string | null => {
            // TODO implement
            // Imagine we only want to match arrays where strings and numbers appear alternately, with minimum 2 elements and maximum 3 elements
            return joinArray(arr);
        };

        expect(matchArray([])).toBeNull();
        expect(matchArray([1])).toBeNull();
        expect(matchArray([1, "a"])).toBe("1a");
        expect(matchArray(["a", "a"])).toBeNull();
        expect(matchArray(["a", 1])).toBe("a1");
        expect(matchArray([1, 1])).toBeNull();
        expect(matchArray([1, "a", 2])).toBe("1a2");
        expect(matchArray(["a", 1, "b"])).toBe("a1b");
        expect(matchArray([1, 1, "b"])).toBeNull();
        expect(matchArray([1, "a", "b"])).toBeNull();
    });

    it("unions", () => {
        type Product =
            | "apple"
            | "banana"
            | "orange"
            | "potato"
            | "carrot"
            | "milk"
            | "cheese"
            | "bread"
            | "chicken"
            | "fish"
            | "pancakes";

        type Category =
            | "fruit"
            | "vegetable"
            | "dairy"
            | "meat"
            | "cereal"
            | "other";

        const assignCategory = (product: Product): Category => {
            return "other";
        };

        expect(assignCategory("apple")).toBe("fruit");
        expect(assignCategory("potato")).toBe("vegetable");
        expect(assignCategory("milk")).toBe("dairy");
        expect(assignCategory("chicken")).toBe("meat");
        expect(assignCategory("pancakes")).toBe("cereal");
    });

    it("intersections", () => {
        type Therapist = {
            name: string;
            age: number;
            profession: "therapist";
        };

        type A4YearOld = {
            name: string;
            age: 4;
            profession: string;
        };
        type BackstreetBoy = {
            name: "Nick" | "Brian" | "Kevin" | "AJ" | "Howie";
            age: number;
            profession: string;
        };

        type Human = Therapist | A4YearOld | BackstreetBoy;

        // TODO implement venn diagram
    });
    it("state machines", () => {
        type PlayerState =
            | {
                  name: "alive";
                  health: number;
                  position: [number, number];
              }
            | { name: "dead"; health: 0; position: [number, number] };

        type Action =
            | {
                  type: "move";
                  payload: [number, number];
              }
            | {
                  type: "receive-damage";
                  payload: number;
              }
            | {
                  type: "heal";
                  payload: number;
              };

        const playerReducer = (
            state: PlayerState,
            action: Action
        ): PlayerState => {
            // TODO implement
            return state;
        };

        expect(
            playerReducer(
                { name: "alive", health: 100, position: [0, 0] },
                { type: "move", payload: [1, 1] }
            )
        ).toEqual({ name: "alive", health: 100, position: [1, 1] });
        expect(
            playerReducer(
                { name: "alive", health: 100, position: [0, 0] },
                { type: "receive-damage", payload: 10 }
            )
        ).toEqual({ name: "alive", health: 90, position: [0, 0] });
        expect(
            playerReducer(
                { name: "alive", health: 100, position: [0, 0] },
                { type: "heal", payload: 10 }
            )
        ).toEqual({ name: "alive", health: 100, position: [0, 0] });
        expect(
            playerReducer(
                { name: "dead", health: 0, position: [0, 0] },
                { type: "move", payload: [1, 1] }
            )
        ).toEqual({ name: "dead", health: 0, position: [0, 0] });
        expect(
            playerReducer(
                { name: "dead", health: 0, position: [0, 0] },
                { type: "receive-damage", payload: 10 }
            )
        ).toEqual({ name: "dead", health: 0, position: [0, 0] });
        expect(
            playerReducer(
                { name: "dead", health: 0, position: [0, 0] },
                { type: "heal", payload: 10 }
            )
        ).toEqual({ name: "dead", health: 0, position: [0, 0] });
    });
});

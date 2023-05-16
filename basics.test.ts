import { match, P } from "ts-pattern";

describe("Welcome to ts-pattern basics", () => {
    it("Let's match some literals", () => {
        type State =
            | {
                  name: "loading";
              }
            | {
                  name: "success";
                  data: string;
              }
            | {
                  name: "error";
                  error: {
                      message: string;
                  };
              };

        const renderText = (state: State): string => {
            // TODO refactor with ts-pattern
            switch (state.name) {
                case "loading":
                    return "Loading...";
                case "success":
                    return state.data;
                case "error":
                    return `An error occurred: ${state.error.message}`;
            }
        };

        expect(renderText({ name: "loading" })).toBe("Loading...");
        expect(renderText({ name: "success", data: "Hello" })).toBe("Hello");
        expect(renderText({ name: "error", error: { message: "Error" } })).toBe(
            "An error occurred: Error"
        );
    });

    it("What if the error is unknown? => Wildcards", () => {
        type State =
            | {
                  name: "loading";
              }
            | {
                  name: "success";
                  data: string;
              }
            | {
                  name: "error";
                  error: unknown; // now let's imagine the error is unknown
              };

        const renderText = (state: State): string => {
            // TODO refactor with ts-pattern
            // P.string
            // P.instanceOf
            switch (state.name) {
                case "loading":
                    return "Loading...";
                case "success":
                    return state.data;
                case "error":
                    if (typeof state.error === "string") {
                        // 😕
                        return `An error occurred: ${state.error}`;
                    } else if (state.error instanceof Error) {
                        // 😣
                        return `An error occurred: ${state.error.message}`;
                    } else if (
                        (state.error as any)?.message &&
                        typeof (state.error as any).message === "string"
                    ) {
                        // 😱
                        return `An error occurred: ${
                            (state.error as any).message
                        }`;
                    } else {
                        return "An unknown error occurred";
                    }
            }
        };

        expect(renderText({ name: "loading" })).toBe("Loading...");
        expect(renderText({ name: "success", data: "Hello" })).toBe("Hello");
        expect(renderText({ name: "error", error: "Error as string" })).toBe(
            "An error occurred: Error as string"
        );
        expect(
            renderText({
                name: "error",
                error: new Error("Error as Error"),
            })
        ).toBe("An error occurred: Error as Error");
        expect(
            renderText({
                name: "error",
                error: { what: { is: { this: "?" } } },
            })
        ).toBe("An unknown error occurred");
    });

    it("Some more basic wildcard patterns", () => {
        const matchPrimitiveType = (input: unknown): string =>
            match(input)
                .with(P.number, () => "It's a number")
                .with(P.string, () => "It's a string")
                .with(P.boolean, () => "It's a boolean")
                .with(P.nullish, () => "It's undefined or null")
                .with(P.array(P._), () => "It's an array (of whatever)")
                .otherwise(() => "It's something else");

        expect(matchPrimitiveType(42)).toBe("It's a number");
        expect(matchPrimitiveType("Hello")).toBe("It's a string");
        expect(matchPrimitiveType(true)).toBe("It's a boolean");
        expect(matchPrimitiveType(undefined)).toBe("It's undefined or null");
        expect(matchPrimitiveType(null)).toBe("It's undefined or null");
        expect(matchPrimitiveType([1, 2, 3])).toBe(
            "It's an array (of whatever)"
        );
    });

    it("Beware! The order matters", () => {
        const matchArray = (input: unknown): string =>
            match(input)
                .with(P.array(P._), () => "It's an array (of whatever)")
                .with(P.array(P.number), () => "It's an array of numbers")
                .otherwise(() => "It's something else");

        expect(matchArray([1, 2, 3])).toBe("It's an array (of numbers)");

        // TIP => Always put the most specific patterns first!!!
    });

    it(".otherwise() vs. .exhaustive() vs. .run()", () => {
        type Animal = "Dog" | "Cat" | "Bird"; // Lion
        const animalVoice = (animal: Animal): string =>
            match(animal)
                .with("Dog", () => "Woof")
                .with("Cat", () => "Meow")
                .with("Bird", () => "Chirp")
                .exhaustive(); // Error in compile time
        //.run(); // => Error in runtime
        // .otherwise(() => "I don't know"); // => Always handled, can turn up in tests

        expect(animalVoice("Dog")).toBe("Woof");
        expect(animalVoice("Cat")).toBe("Meow");
        expect(animalVoice("Bird")).toBe("Chirp");
        // expect(animalVoice("Lion")).toBe("Roar"); // => Error
    });
});

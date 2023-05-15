import { match } from "ts-pattern";

describe("Example", () => {
    it("should return 4", () => {
        expect(
            match(2)
                .with(2, () => "Two!")
                .otherwise(() => "other")
        ).toBe("Two!");
    });
});

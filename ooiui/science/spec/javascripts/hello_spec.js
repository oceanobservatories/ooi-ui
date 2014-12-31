describe("Test hello.js", function() {
	it("returns 'hello'",function () {
		var result = Hello.world();
		expect(result).toBe("Hello");
	});

	it("returns 'you'", function() {
		var result2 = You.me();
		expect(result2).toBe("You");
	});
});


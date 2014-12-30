describe("Test hello.js", function() {
	it("return 'hello'", function() {
		var result = Hello.world();
		expect(result).toBe("Hello");
	});
});
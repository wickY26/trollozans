'use strict';

(function() {
	// Poems Controller Spec
	describe('Poems Controller Tests', function() {
		// Initialize global variables
		var PoemsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Poems controller.
			PoemsController = $controller('PoemsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Poem object fetched from XHR', inject(function(Poems) {
			// Create sample Poem using the Poems service
			var samplePoem = new Poems({
				name: 'New Poem'
			});

			// Create a sample Poems array that includes the new Poem
			var samplePoems = [samplePoem];

			// Set GET response
			$httpBackend.expectGET('poems').respond(samplePoems);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.poems).toEqualData(samplePoems);
		}));

		it('$scope.findOne() should create an array with one Poem object fetched from XHR using a poemId URL parameter', inject(function(Poems) {
			// Define a sample Poem object
			var samplePoem = new Poems({
				name: 'New Poem'
			});

			// Set the URL parameter
			$stateParams.poemId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/poems\/([0-9a-fA-F]{24})$/).respond(samplePoem);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.poem).toEqualData(samplePoem);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Poems) {
			// Create a sample Poem object
			var samplePoemPostData = new Poems({
				name: 'New Poem'
			});

			// Create a sample Poem response
			var samplePoemResponse = new Poems({
				_id: '525cf20451979dea2c000001',
				name: 'New Poem'
			});

			// Fixture mock form input values
			scope.name = 'New Poem';

			// Set POST response
			$httpBackend.expectPOST('poems', samplePoemPostData).respond(samplePoemResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Poem was created
			expect($location.path()).toBe('/poems/' + samplePoemResponse._id);
		}));

		it('$scope.update() should update a valid Poem', inject(function(Poems) {
			// Define a sample Poem put data
			var samplePoemPutData = new Poems({
				_id: '525cf20451979dea2c000001',
				name: 'New Poem'
			});

			// Mock Poem in scope
			scope.poem = samplePoemPutData;

			// Set PUT response
			$httpBackend.expectPUT(/poems\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/poems/' + samplePoemPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid poemId and remove the Poem from the scope', inject(function(Poems) {
			// Create new Poem object
			var samplePoem = new Poems({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Poems array and include the Poem
			scope.poems = [samplePoem];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/poems\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePoem);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.poems.length).toBe(0);
		}));
	});
}());
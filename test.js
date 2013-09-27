/*jshint boss:true */
/*jshint es5:true */
/*jshint expr:true */
var should = chai.should();
describe("namespace", function() {
    beforeEach(function () {
        this.ns = new namespace();
        this.obj = {};
        this.module = this.ns.import('Test');
        this.properties = {
            test: 'test_value',
            test2: 'another_test_value'
        };
    });
    describe('_checkNamespace', function () {
        beforeEach(function () {
            this.importSpy = sinon.spy(this.ns, 'import');
            this.registerSpy = sinon.spy(this.ns, 'register');
        });
        afterEach(function () {
            this.ns.import.restore();
            this.ns.register.restore();
        });
        it('rejects namespaces that start with a number', function () {

            try {
                this.ns.import('1');
            } catch (e) { /* expected */ }
            this.importSpy.threw('NamespaceError').should.be.true;
            this.importSpy.getCall(0).exception.message.should.equal('Invalid namespace \'1\' provided.');

            try {
                this.ns.import('a.1');
            } catch (e) { /* expected */ }
            this.importSpy.threw('NamespaceError').should.be.true;
            this.importSpy.getCall(1).exception.message.should.equal('Invalid namespace \'a.1\' provided.');

            try {
                this.ns.register('1', {});
            } catch (e) { /* expected */ }
            this.registerSpy.threw('NamespaceError').should.be.true;
            this.registerSpy.getCall(0).exception.message.should.equal('Invalid namespace \'1\' provided.');

            try {
                this.ns.register('a.1', {});
            } catch (e) { /* expected */ }
            this.registerSpy.threw('NamespaceError').should.be.true;
            this.registerSpy.getCall(1).exception.message.should.equal('Invalid namespace \'a.1\' provided.');
        });
        it('rejects namespaces that with special characters (excluding $ and _ and . as a delimiter)', function () {
            var special_characters = [ '`', '~', '!', '@', '#', '%', '^', '&', '*', '(', ')', '-', '+', '=', '{', '}','[',']', ';', ':', '\'', '"', ',', '<', '>', '/', '?', '\\', '|'];
            for (var i = 0; i < special_characters.length; i++) {
                try {
                    this.ns.import(special_characters[i]);
                } catch (e) { /* expected */ }
                this.importSpy.threw('NamespaceError').should.be.true;
                this.importSpy.getCall(i).exception.message.should.equal('Invalid namespace \'' + special_characters[i] + '\' provided.');

                try {
                    this.ns.register(special_characters[i], {});
                } catch (e) { /* expected */ }
                this.registerSpy.threw('NamespaceError').should.be.true;
                this.registerSpy.getCall(i).exception.message.should.equal('Invalid namespace \'' + special_characters[i] + '\' provided.');
            }
        });
        it('rejects namespaces that start with a period)', function () {
            try {
                this.ns.import('.');
            } catch (e) { /* expected */ }
            this.importSpy.threw('NamespaceError').should.be.true;
            this.importSpy.getCall(0).exception.message.should.equal('Invalid namespace \'.\' provided.');

            try {
                this.ns.register('.', {});
            } catch (e) { /* expected */ }
            this.registerSpy.threw('NamespaceError').should.be.true;
            this.registerSpy.getCall(0).exception.message.should.equal('Invalid namespace \'.\' provided.');
        });
    });
    describe('initialize', function () {
        it("has a method for creating namespaces", function () {
            should.exist(this.ns.initialize);
            var ns = this.ns.initialize();
            should.exist(ns);
            ns.should.be.an.instanceof(namespace);
        });
        it('sets options as properties of module', function () {
            var ns = this.ns.initialize(this.properties);
            ns.test.should.equal('test_value');
            ns.test2.should.equal('another_test_value');
        });
    });
    describe("import", function () {
        it('creates modules that are namespaces themselves', function () {
            this.module.should.be.an.instanceof(namespace);
            this.ns.Test.should.be.an.instanceof(namespace);
        });
        it("creates modules that don't exist", function() {
            this.ns.should.not.have.property('Test2');
            should.exist(this.ns.import('Test2'));
            this.ns.should.have.property('Test2');
            this.ns.Test2.should.equal(this.ns.import('Test2'));
        });
        it("allows reference to modules directly as property", function () {
            this.ns.import('Test');
            should.exist(this.ns.Test);
            this.ns.Test.should.be.equal(this.ns.import('Test'));
        });
        it('passes properties to initialize', function () {
            var module = this.ns.import('Test2', this.properties);
            module.test.should.equal('test_value');
            module.test2.should.equal('another_test_value');
        });
        it('allows the import of objects', function () {
            var module = this.ns.import('Test2', this.properties);
            var test = this.ns.import('Test2.test');
            should.exist(test);
            test.should.equal('test_value');
            test = module.import('test');
            should.exist(test);
            test.should.equal('test_value');
        });
    });
    describe('register', function () {
        it('rejects registration with less than two parameters', function () {
            var spy = sinon.spy(namespace.prototype, 'register');
            try { this.ns.register('Test'); }
            catch (e) { /* Expected */ }
            spy.threw('NamespaceError').should.be.true;
            spy.getCall(0).exception.message.should.equal('Two arguments are required.');
            namespace.prototype.register.restore();
        });
        it('rejects registration where the first parameter is not a string', function () {
            var spy = sinon.spy(namespace.prototype, 'register');
            try { this.ns.register(1,2); }
            catch (e) { /* Expected */ }
            spy.threw('NamespaceError').should.be.true;
            spy.getCall(0).exception.message.should.equal('Namespace should be a string.');
            namespace.prototype.register.restore();
        });
        it ("has a method for registering objects in namespace", function () {
            should.exist(this.ns.register);
            this.module.should.have.property('register');
        });
        it("allows 1-arity namespaces to be defined", function() {
            this.module.should.have.property('register');
            this.module.register('Namespace', this.obj);
            this.module.Namespace.should.equal(this.obj);
        });
        it("allows 2-arity namespaces to be defined", function() {
            this.module.should.have.property('register');
            this.module.register('Name.Space', this.obj);
            this.module.Name.Space.should.equal(this.obj);
        });

        it("allows arbitrarily long namespaces to be created", function() {
            this.module.register('Very.Long.Name.Space.That.Keeps.Going.And.Going', this.obj);
            this.module.Very.Long.Name.Space.That.Keeps.Going.And.Going.should.equal(this.obj);
            this.ns.Test.Very.Long.Name.Space.That.Keeps.Going.And.Going.should.equal(this.obj);
        });
    });
});

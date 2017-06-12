import { expect } from 'chai';
import { Query as q } from '../../src/query/query';
import { QueryItemsList } from '../../src/query/queryItemsList';
import { VirtualDOM } from '../_helpers/dom.helper';


describe.only('Class QueryItemsList(queryString:string, parent?:HTMLElement)', () => {
	VirtualDOM.html(`
		<p>Just a simple paragraph.</p>
		<p>Just a simple paragraph.</p>
		<p>Just a simple paragraph.</p>
		<p class="test-one">Just a simple paragraph with class.</p>
		<p class="test-two">Just a simple paragraph with class.</p>
		<p class="test-two">Just a simple paragraph with class2.</p>
		<p class="test-three">Just a simple paragraph with class.</p>
		<p class="test-three">Just a simple paragraph with class.</p>
		<p class="test-three">Just a simple paragraph with class.</p>
	`);
	before(() => {
		
	});

	it('Getter "first" should return first child of queryItems', () => {
		let testQuery = q('p');
		expect(testQuery.first).to.be.equal(testQuery.queryItems[0]);
	});

	it('In method "each", count of callbacks should be equals to getter "count".', () => {
		let testQuery = q('p');
		let callbackTimes = 0;
		testQuery.each((item) => {
			callbackTimes++;
		});
		expect(callbackTimes).to.be.equal(testQuery.count);
	});

	it('Method "filter", should filter queryItems property.', () => {
		let testQuery = q('p');
		testQuery.filter(q => q.class.contains('test-one'));
		expect(testQuery.count).to.be.equal(1);
	});

	it('Method "single", should return QueryItem instance.', () => {
		let testQuery = q('p');
		let queryItem = testQuery.single(q => q.class.contains('test-one') == true);
		console.log(queryItem);
		expect(queryItem).to.be;
	});

	describe('Method add()', () => {
		let testQuery = q('.test-one');
		it('Should ignore duplicate elements', async () => {
			testQuery.add('.test-one');
			expect(testQuery.count).to.be.equal(1);
		});

		it('Should take string as parametr', () => {
			testQuery.add('.test-two');
			expect(testQuery.count).to.be.equal(3);
		});

		it('Should take HTMLElement as parametr', () => {
			testQuery.add(document.querySelector('.test-three'));
			expect(testQuery.count).to.be.equal(4);
		});

		it('Should take NodeListOf as parametr', () => {
			testQuery.add(document.querySelectorAll('.test-three'));
			expect(testQuery.count).to.be.equal(6);
		});

		it('Should take QueryItem as parametr', () => {
			testQuery.add(q('p').first);
			expect(testQuery.count).to.be.equal(7);
		});

		it('Should take QueryItemsList as parametr', () => {
			testQuery.add(q('p'));
			expect(testQuery.count).to.be.equal(9);
		});
	});

});

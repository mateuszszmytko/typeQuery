import { expect } from 'chai';
import { Query as q } from '../../src/query/query';
import { QueryItemsList } from '../../src/query/queryItemsList';
import { VirtualDOM } from '../helpers/dom.helper';


describe('Function Query(queryString:string)', () => {
	
	before(() => {
		VirtualDOM.html(`
			<p>Just a simple paragraph.</p>
		`);
	});

	it('Should return instance of QueryItemsList', () => {
		let testQuery = q('p');
		expect(testQuery).to.be.instanceof(QueryItemsList);
	});

});

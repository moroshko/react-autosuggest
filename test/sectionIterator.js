import { expect } from 'chai';
import sectionIterator from '../src/sectionIterator.js';

describe('sectionIterator', () => {
  describe('with no sections', () => {
    describe('and no items', () => {
      beforeEach(() => {
        sectionIterator.setData(0);
      });

      it('should calculate next', () => {
        expect(sectionIterator.next([null, null])).to.deep.equal([null, null]);
      });

      it('should calculate prev', () => {
        expect(sectionIterator.prev([null, null])).to.deep.equal([null, null]);
      });

      it('should calculate isLast', () => {
        expect(sectionIterator.isLast([null, null])).to.be.true;
      });
    });

    describe('and 1 item', () => {
      beforeEach(() => {
        sectionIterator.setData(1);
      });

      it('should calculate next', () => {
        expect(sectionIterator.next([null, null])).to.deep.equal([null, 0]);
        expect(sectionIterator.next([null, 0])).to.deep.equal([null, null]);
      });

      it('should calculate prev', () => {
        expect(sectionIterator.prev([null, null])).to.deep.equal([null, 0]);
        expect(sectionIterator.prev([null, 0])).to.deep.equal([null, null]);
      });

      it('should calculate isLast', () => {
        expect(sectionIterator.isLast([null, null])).to.be.false;
        expect(sectionIterator.isLast([null, 0])).to.be.true;
      });
    });

    describe('and multiple items', () => {
      beforeEach(() => {
        sectionIterator.setData(4);
      });

      it('should calculate next', () => {
        expect(sectionIterator.next([null, null])).to.deep.equal([null, 0]);
        expect(sectionIterator.next([null, 0])).to.deep.equal([null, 1]);
        expect(sectionIterator.next([null, 3])).to.deep.equal([null, null]);
      });

      it('should calculate prev', () => {
        expect(sectionIterator.prev([null, null])).to.deep.equal([null, 3]);
        expect(sectionIterator.prev([null, 3])).to.deep.equal([null, 2]);
        expect(sectionIterator.prev([null, 0])).to.deep.equal([null, null]);
      });

      it('should calculate isLast', () => {
        expect(sectionIterator.isLast([null, null])).to.be.false;
        expect(sectionIterator.isLast([null, 0])).to.be.false;
        expect(sectionIterator.isLast([null, 3])).to.be.true;
      });
    });
  });

  describe('with 1 section', () => {
    describe('and no items', () => {
      beforeEach(() => {
        sectionIterator.setData([0]);
      });

      it('should calculate next', () => {
        expect(sectionIterator.next([null, null])).to.deep.equal([null, null]);
      });

      it('should calculate prev', () => {
        expect(sectionIterator.prev([null, null])).to.deep.equal([null, null]);
      });

      it('should calculate isLast', () => {
        expect(sectionIterator.isLast([null, null])).to.be.true;
      });
    });

    describe('and 1 item', () => {
      beforeEach(() => {
        sectionIterator.setData([1]);
      });

      it('should calculate next', () => {
        expect(sectionIterator.next([null, null])).to.deep.equal([0, 0]);
        expect(sectionIterator.next([0, 0])).to.deep.equal([null, null]);
      });

      it('should calculate prev', () => {
        expect(sectionIterator.prev([null, null])).to.deep.equal([0, 0]);
        expect(sectionIterator.prev([0, 0])).to.deep.equal([null, null]);
      });

      it('should calculate isLast', () => {
        expect(sectionIterator.isLast([null, null])).to.be.false;
        expect(sectionIterator.isLast([0, 0])).to.be.true;
      });
    });

    describe('and multiple items', () => {
      beforeEach(() => {
        sectionIterator.setData([4]);
      });

      it('should calculate next', () => {
        expect(sectionIterator.next([null, null])).to.deep.equal([0, 0]);
        expect(sectionIterator.next([0, 0])).to.deep.equal([0, 1]);
        expect(sectionIterator.next([0, 3])).to.deep.equal([null, null]);
      });

      it('should calculate prev', () => {
        expect(sectionIterator.prev([null, null])).to.deep.equal([0, 3]);
        expect(sectionIterator.prev([0, 3])).to.deep.equal([0, 2]);
        expect(sectionIterator.prev([0, 0])).to.deep.equal([null, null]);
      });

      it('should calculate isLast', () => {
        expect(sectionIterator.isLast([null, null])).to.be.false;
        expect(sectionIterator.isLast([0, 0])).to.be.false;
        expect(sectionIterator.isLast([0, 3])).to.be.true;
      });
    });
  });

  describe('with multiple sections', () => {
    beforeEach(() => {
      sectionIterator.setData([2, 0, 0, 4, 1, 0, 3, 0]);
    });

    it('should calculate next', () => {
      expect(sectionIterator.next([null, null])).to.deep.equal([0, 0]);
      expect(sectionIterator.next([0, 0])).to.deep.equal([0, 1]);
      expect(sectionIterator.next([0, 1])).to.deep.equal([3, 0]);
      expect(sectionIterator.next([3, 0])).to.deep.equal([3, 1]);
      expect(sectionIterator.next([3, 3])).to.deep.equal([4, 0]);
      expect(sectionIterator.next([4, 0])).to.deep.equal([6, 0]);
      expect(sectionIterator.next([6, 2])).to.deep.equal([null, null]);
    });

    it('should calculate prev', () => {
      expect(sectionIterator.prev([null, null])).to.deep.equal([6, 2]);
      expect(sectionIterator.prev([6, 2])).to.deep.equal([6, 1]);
      expect(sectionIterator.prev([6, 0])).to.deep.equal([4, 0]);
      expect(sectionIterator.prev([4, 0])).to.deep.equal([3, 3]);
      expect(sectionIterator.prev([3, 3])).to.deep.equal([3, 2]);
      expect(sectionIterator.prev([3, 0])).to.deep.equal([0, 1]);
      expect(sectionIterator.prev([0, 0])).to.deep.equal([null, null]);
    });

    it('should calculate isLast', () => {
      expect(sectionIterator.isLast([null, null])).to.be.false;
      expect(sectionIterator.isLast([0, 0])).to.be.false;
      expect(sectionIterator.isLast([0, 1])).to.be.false;
      expect(sectionIterator.isLast([3, 0])).to.be.false;
      expect(sectionIterator.isLast([3, 3])).to.be.false;
      expect(sectionIterator.isLast([4, 0])).to.be.false;
      expect(sectionIterator.isLast([6, 2])).to.be.true;
    });
  });
});

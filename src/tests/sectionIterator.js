'use strict';

jest.dontMock('../sectionIterator.js');

import sectionIterator from '../sectionIterator.js';

describe('sectionIterator', function() {
  describe('no sections', function() {
    describe('no items', function() {
      beforeEach(function() {
        sectionIterator.setData(0);
      });

      it('next', function() {
        expect(sectionIterator.next([null, null])).toEqual([null, null]);
      });

      it('prev', function() {
        expect(sectionIterator.prev([null, null])).toEqual([null, null]);
      });
    });

    describe('1 item', function() {
      beforeEach(function() {
        sectionIterator.setData(1);
      });

      it('next', function() {
        expect(sectionIterator.next([null, null])).toEqual([null, 0]);
        expect(sectionIterator.next([null, 0])).toEqual([null, null]);
      });

      it('prev', function() {
        expect(sectionIterator.prev([null, null])).toEqual([null, 0]);
        expect(sectionIterator.prev([null, 0])).toEqual([null, null]);
      });
    });

    describe('multiple items', function() {
      beforeEach(function() {
        sectionIterator.setData(4);
      });

      it('next', function() {
        expect(sectionIterator.next([null, null])).toEqual([null, 0]);
        expect(sectionIterator.next([null, 0])).toEqual([null, 1]);
        expect(sectionIterator.next([null, 3])).toEqual([null, null]);
      });

      it('prev', function() {
        expect(sectionIterator.prev([null, null])).toEqual([null, 3]);
        expect(sectionIterator.prev([null, 3])).toEqual([null, 2]);
        expect(sectionIterator.prev([null, 0])).toEqual([null, null]);
      });
    });
  });

  describe('1 section', function() {
    describe('no items', function() {
      beforeEach(function() {
        sectionIterator.setData([0]);
      });

      it('next', function() {
        expect(sectionIterator.next([null, null])).toEqual([null, null]);
      });

      it('prev', function() {
        expect(sectionIterator.prev([null, null])).toEqual([null, null]);
      });
    });

    describe('1 item', function() {
      beforeEach(function() {
        sectionIterator.setData([1]);
      });

      it('next', function() {
        expect(sectionIterator.next([null, null])).toEqual([0, 0]);
        expect(sectionIterator.next([0, 0])).toEqual([null, null]);
      });

      it('prev', function() {
        expect(sectionIterator.prev([null, null])).toEqual([0, 0]);
        expect(sectionIterator.prev([0, 0])).toEqual([null, null]);
      });
    });

    describe('multiple items', function() {
      beforeEach(function() {
        sectionIterator.setData([4]);
      });

      it('next', function() {
        expect(sectionIterator.next([null, null])).toEqual([0, 0]);
        expect(sectionIterator.next([0, 0])).toEqual([0, 1]);
        expect(sectionIterator.next([0, 3])).toEqual([null, null]);
      });

      it('prev', function() {
        expect(sectionIterator.prev([null, null])).toEqual([0, 3]);
        expect(sectionIterator.prev([0, 3])).toEqual([0, 2]);
        expect(sectionIterator.prev([0, 0])).toEqual([null, null]);
      });
    });
  });

  describe('multiple sections', function() {
    beforeEach(function() {
      sectionIterator.setData([2, 0, 0, 4, 1, 0, 3, 0]);
    });

    it('next', function() {
      expect(sectionIterator.next([null, null])).toEqual([0, 0]);
      expect(sectionIterator.next([0, 0])).toEqual([0, 1]);
      expect(sectionIterator.next([0, 1])).toEqual([3, 0]);
      expect(sectionIterator.next([3, 0])).toEqual([3, 1]);
      expect(sectionIterator.next([3, 3])).toEqual([4, 0]);
      expect(sectionIterator.next([4, 0])).toEqual([6, 0]);
      expect(sectionIterator.next([6, 2])).toEqual([null, null]);
    });

    it('prev', function() {
      expect(sectionIterator.prev([null, null])).toEqual([6, 2]);
      expect(sectionIterator.prev([6, 2])).toEqual([6, 1]);
      expect(sectionIterator.prev([6, 0])).toEqual([4, 0]);
      expect(sectionIterator.prev([4, 0])).toEqual([3, 3]);
      expect(sectionIterator.prev([3, 3])).toEqual([3, 2]);
      expect(sectionIterator.prev([3, 0])).toEqual([0, 1]);
      expect(sectionIterator.prev([0, 0])).toEqual([null, null]);
    });
  });
});

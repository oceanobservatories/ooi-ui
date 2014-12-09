#!/usr/bin/env python
'''
tests.science.test_cache

Tests the cache to make sure it works
'''
from ooiui.science.app import app

import ooiui.science.interface.toc as toc
from requests.models import Response
from mock import Mock


import time
import unittest

def mock_get(*args, **kwargs):
    '''
    Returns an empty response object after 2 seconds
    '''
    empty_response = Response()
    empty_response.status_code = 200
    empty_response._content = '{}'
    time.sleep(2)
    return empty_response



        

class TestCache(unittest.TestCase):
    '''
    Tests that the cache is functional and working
    '''

    def setUp(self):
        '''
        Sets up the mock client and application context
        '''
        # Override the requests.get method in this module so we can mock the response

        toc.requests.get = mock_get
        app.config['TESTING'] = True
        self.app = app.test_client()

        # I need to initialize the application context so that the cache is initialized
        self.app_context = app.app_context()
        self.app_context.__enter__()

    def tearDown(self):
        '''
        Tears down the application context
        '''
        # Must clean up the context
        self.app_context.__exit__(None, None, None)

    def test_cache(self):
        '''
        Verifies that the cache is working
        '''
        t0 = time.time()
        self.app.get('/gettoc/')
        t1 = time.time()
        # Make sure the cache is empty
        assert (t1 - t0)  >= 2 

        # Asser that the cache is warm
        t0 = time.time()
        response = self.app.get('/gettoc/')
        assert response.data == '{}'
        t1 = time.time()
        # Make sure the cache is empty
        assert (t1 - t0)  < 2

        # Assert that flush clears the cache
        self.app.get('/flush')
        t0 = time.time()
        self.app.get('/gettoc/')
        t1 = time.time()
        # Make sure the cache is empty
        assert (t1 - t0)  >= 2 







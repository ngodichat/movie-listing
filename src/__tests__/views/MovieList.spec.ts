import {flushPromises, mount} from '@vue/test-utils'
import MovieList from '../../views/MovieList.vue'
import store from '../../store'
import {vi, expect} from 'vitest'
import axios from "axios";

vi.mock('axios')

describe('MovieList.vue', () => {
    beforeEach(() => {
        // Reset store state before each test
        store.commit('setSearchResults', [
            {Title: 'Movie 1', Year: '2023', imdbID: '1'},
            {Title: 'Movie 2', Year: '2023', imdbID: '2'}
        ])
        store.commit('setCurrentPage', 1)
        store.commit('setTotalPages', 5)
        vi.resetAllMocks()
    })

    it('renders movie grid with search results', () => {
        const wrapper = mount(MovieList, {
            global: {
                plugins: [store],
                stubs: ['SearchBar', 'MovieGrid', 'Pagination']
            }
        })

        expect(wrapper.findComponent({name: 'MovieGrid'}).exists()).toBe(true)
        expect(wrapper.findComponent({name: 'SearchBar'}).exists()).toBe(true)
    })

    it('handles page changes correctly', async () => {
        const mockResponse = {
            data: {
                data: [{Title: 'Mock Movie', Year: '2023', imdbID: '123'}],
                total_pages: 3
            }
        };

        // Mock axios GET request
        (axios.get as jest.Mock).mockResolvedValue(mockResponse)
        const wrapper = mount(MovieList, {
            global: {
                plugins: [store],
                stubs: ['SearchBar', 'MovieGrid']
            }
        })

        const pagination = wrapper.findComponent({name: 'Pagination'})
        pagination.vm.$emit('page-change', 2)
        await flushPromises()
        expect(store.state.currentPage).toBe(2)
    })
})

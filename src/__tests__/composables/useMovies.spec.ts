import {useMovies} from '@/composables/useMovies'
import axios from 'axios'
import {createStore} from 'vuex'
import {flushPromises, mount} from '@vue/test-utils'
import {describe, it, expect, beforeEach, vi} from 'vitest'
import {reactive} from "vue";

// Mock axios
vi.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('useMovies composable', () => {
    let store: any

    beforeEach(() => {
        store = createStore({
            state: {
                searchResults: [],
                totalPages: 0,
                currentPage: 1
            },
            mutations: {
                setSearchResults(state, payload) {
                    state.searchResults = payload; // Update searchResults
                },
                setTotalPages(state, payload) {
                    state.totalPages = payload; // Update totalPages
                },
                setCurrentPage(state, payload) {
                    state.currentPage = payload; // Update currentPage
                },
            }
        })
    })

    // Wrapper Component to test composable
    const TestComponent = {
        template: '<div></div>',
        setup() {
            const movies = useMovies()
            return reactive(movies)
        }
    }

    it('should fetch movies and update store', async () => {
        const mockResponse = {
            data: {
                data: [{Title: 'Test Movie', Year: '2023', imdbID: '123'}],
                total_pages: 5
            }
        }
        mockedAxios.get.mockResolvedValue(mockResponse)

        const wrapper = mount(TestComponent, {
            global: {
                plugins: [store]
            }
        })

        const {searchMovies, loading, error} = wrapper.vm as ReturnType<typeof useMovies>

        // Trigger search
        await searchMovies('test')
        await flushPromises()

        expect(loading).toBe(false)
        expect(error).toBeNull()

        // Check if API was called
        expect(mockedAxios.get).toHaveBeenCalledWith(
            expect.stringContaining('/movies/search/?Title=test')
        )

        // Check store mutations were committed
        expect(store.state.searchResults).toEqual(mockResponse.data.data)
        expect(store.state.totalPages).toBe(mockResponse.data.total_pages)
        expect(store.state.currentPage).toBe(1)
    })

    it('should handle API failure', async () => {
        // mockedAxios.get.mockRejectedValue(new Error('API Error'))
        (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'))
        // mockedAxios.get.mockImplementation(() => Promise.reject(new Error('API Error')))

        const wrapper = mount(TestComponent, {
            global: {
                plugins: [store]
            }
        })
        const {searchMovies} = wrapper.vm as ReturnType<typeof useMovies>

        await searchMovies('test')
        await flushPromises()

        expect(wrapper.vm.error).toBe('Failed to fetch movies')
        expect(wrapper.vm.loading).toBe(false)
    })
})

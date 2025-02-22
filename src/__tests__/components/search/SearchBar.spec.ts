import {mount} from '@vue/test-utils'
import SearchBar from '../../../components/search/SearchBar.vue'
import {createStore} from 'vuex'
import {vi, expect} from 'vitest'

const mutations = {
    setSearchQuery: vi.fn()
}

const store = createStore({
    state: {
        searchQuery: ''
    },
    mutations
})

// Mock useMovies composable
vi.mock('../../../composables/useMovies', () => ({
    useMovies: () => ({
        loading: false,
        searchMovies: vi.fn()
    })
}))

describe('SearchBar.vue', () => {
    let wrapper: any

    beforeEach(() => {
        wrapper = mount(SearchBar, {
            global: {
                plugins: [store]
            }
        })
    })

    it('renders the search bar', () => {
        expect(wrapper.find('.search-bar').exists()).toBe(true)
    })

    it('updates search input correctly', async () => {
        const input = wrapper.find('input')
        await input.setValue('Inception')
        expect(wrapper.vm.searchQuery).toBe('Inception')
    })

    it('calls handleSearch on enter key', async () => {
        const input = wrapper.find('input')
        await input.setValue('Avatar')
        await input.trigger('keyup.enter')
        await new Promise((r) => setTimeout(r, 350)) // Wait for debounce
        expect(mutations.setSearchQuery).toHaveBeenCalledWith(expect.any(Object), 'Avatar')
    })

    it('calls showAllMovies when refresh button is clicked', async () => {
        const button = wrapper.find('.refresh-btn')
        await button.trigger('click')
        expect(mutations.setSearchQuery).toHaveBeenCalledWith(expect.any(Object), '')
    })

    it('shows loading indicator when loading is true', async () => {
        vi.mock('@/composables/useMovies', () => ({
            useMovies: () => ({
                loading: true,
                searchMovies: vi.fn()
            })
        }))

        wrapper = mount(SearchBar, {
            global: {
                plugins: [store]
            }
        })

        expect(wrapper.find('.loader').exists()).toBe(true)
    })
})
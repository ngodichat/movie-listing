import {mount} from '@vue/test-utils'
import Pagination from '../../../components/navigation/Pagination.vue'

import {expect} from 'vitest'

describe("Pagination.vue", () => {
    it("renders correct page numbers", () => {
        const wrapper = mount(Pagination, {
            props: {
                currentPage: 5,
                totalPages: 5,
            },
        });

        // Kiểm tra nếu có 3 trang hiển thị
        const pageButtons = wrapper.findAll(".pages button");
        expect(pageButtons).toHaveLength(3);

        // Kiểm tra trang đang active là 5
        expect(wrapper.find(".pages .active").text()).toBe("5");
    });

    it("disables Previous button when on first page", () => {
        const wrapper = mount(Pagination, {
            props: {
                currentPage: 1,
                totalPages: 5,
            },
        });

        const prevButton = wrapper.find("button:first-child");
        expect(prevButton.attributes("disabled")).toBeDefined();
    });

    it("disables Next button when on last page", () => {
        const wrapper = mount(Pagination, {
            props: {
                currentPage: 5,
                totalPages: 5,
            },
        });

        const nextButton = wrapper.find(".pagination > button:last-of-type");
        expect(nextButton.attributes("disabled")).toBeDefined();
    });

    it("emits 'page-change' event when clicking on a page number", async () => {
        const wrapper = mount(Pagination, {
            props: {
                currentPage: 3,
                totalPages: 5,
            },
        });

        const pageButtons = wrapper.findAll(".pages button");
        const page4Button = pageButtons.find((btn) => btn.text() === "4"); // Tìm nút có text "4"
        expect(page4Button).toBeTruthy(); // Đảm bảo nút tồn tại

        await page4Button!.trigger("click");

        expect(wrapper.emitted("page-change")).toBeTruthy();
        expect(wrapper.emitted("page-change")![0]).toEqual([4]);

    });

    it("emits 'page-change' when clicking Previous and Next", async () => {
        const wrapper = mount(Pagination, {
            props: {
                currentPage: 3,
                totalPages: 5,
            },
        });

        const prevButton = wrapper.find(".pagination > button:first-of-type");
        const nextButton = wrapper.find(".pagination > button:last-of-type");

        await prevButton.trigger("click");
        expect(wrapper.emitted("page-change")![0]).toEqual([2]);

        await nextButton.trigger("click");
        expect(wrapper.emitted("page-change")![1]).toEqual([4]);
    });
});
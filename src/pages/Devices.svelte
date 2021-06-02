<script lang="ts">
    import { onMount } from "svelte";
    import { Http } from "../services/http";
    import DataTable, {
        Head,
        Body,
        Row,
        Cell,
        Pagination,
    } from "@smui/data-table";
    import Select, { Option } from "@smui/select";
    import IconButton from "@smui/icon-button";
    import { Label } from "@smui/common";
    import LinearProgress from '@smui/linear-progress';

    let displayColumns: any[] = [];
    let rowsPerPage = 10;
    let currentPage = 0;
    let totalItems = 0;
    let items = [];
    let isFinishedLoading = false;

    $: start = currentPage * rowsPerPage;
    $: end = Math.min(start + rowsPerPage, totalItems);
    $: lastPage = Math.max(Math.ceil(totalItems / rowsPerPage) - 1, 0);

    $: if (currentPage > lastPage) {
        currentPage = lastPage;
    }

    $: getDevices(currentPage, rowsPerPage).then((resp) => {
        if (resp) items = resp.items;
        isFinishedLoading = true;
    });

    const instance = new Http(
        "https://admin.dev.orcam.io/api/v8",
        "accessKey test-key-id-1"
    );

    onMount(async () => {
        const resp = await getDevices(0, rowsPerPage);
        isFinishedLoading = true;
        if (!resp) return;

        displayColumns = createDisplayColumns(resp.items);
        items = resp.items;
        totalItems = resp.total;
    });

    const createDisplayColumns = (items: any[]): any[] => {
        if (items && items[0]) return Object.keys(items[0]);
        else return [];
    };

    const getDevices = (page: number, size: number): Promise<any> => {
        isFinishedLoading = false;
        return instance.get("/devices", {
            page: page,
            size: size,
        });
    };
</script>

<DataTable stickyHeader table$aria-label="Todo list" style="width: 100%;">
    <Head>
        <Row>
            {#each displayColumns as column, i (i)}
                <Cell>{column}</Cell>
            {/each}
        </Row>
    </Head>
    <Body>
        {#each items as item, i (i)}
            <Row>
                {#each displayColumns as column, i (i)}
                    <Cell>{item[column]}</Cell>
                {/each}
            </Row>
        {/each}
    </Body>

    <Pagination slot="paginate">
        <svelte:fragment slot="rowsPerPage">
            <Label>Rows Per Page</Label>
            <Select variant="outlined" bind:value={rowsPerPage} noLabel>
                <Option value={10}>10</Option>
                <Option value={25}>25</Option>
                <Option value={100}>100</Option>
            </Select>
        </svelte:fragment>
        <svelte:fragment slot="total">
            {start + 1}-{end} of {totalItems}
        </svelte:fragment>

        <IconButton
            class="material-icons"
            action="first-page"
            title="First page"
            on:click={() => (currentPage = 0)}
            disabled={currentPage === 0}>first_page</IconButton
        >
        <IconButton
            class="material-icons"
            action="prev-page"
            title="Prev page"
            on:click={() => currentPage--}
            disabled={currentPage === 0}>chevron_left</IconButton
        >
        <IconButton
            class="material-icons"
            action="next-page"
            title="Next page"
            on:click={() => currentPage++}
            disabled={currentPage === lastPage}>chevron_right</IconButton
        >
        <IconButton
            class="material-icons"
            action="last-page"
            title="Last page"
            on:click={() => (currentPage = lastPage)}
            disabled={currentPage === lastPage}>last_page</IconButton
        >
    </Pagination>

    <LinearProgress
        indeterminate
        bind:closed={isFinishedLoading}
        aria-label="Data is being loaded..."
        slot="progress"
    />
</DataTable>

<style>
</style>

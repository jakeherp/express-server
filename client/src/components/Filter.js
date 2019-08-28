import React from "react"

const Filter = ({ handler: { handleFilter }, value: { filterName } }) => (
	<form onSubmit={e => e.preventDefault()}>
		<div>
			filter shown with{" "}
			<input value={filterName} onChange={handleFilter} />
		</div>
	</form>
)

export default Filter

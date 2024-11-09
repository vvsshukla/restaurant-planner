const Sidebar = ({ onChangeAction }) => {
    return <div className='sidebar flex-center'>
        <div className='select-cuisine'>
            <label htmlFor="cuisine">Pick a cuisine</label>
            <select className='cuisine' id="cuisine" onChange={(e) => onChangeAction(e)}>
                <option value="">Select Cuisine</option>
                <option value="Indian">Indian</option>
                <option value="Italian">Italian</option>
            </select>
        </div>
    </div>;
}

export default Sidebar;
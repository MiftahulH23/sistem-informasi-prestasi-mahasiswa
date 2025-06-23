import React, { useState } from "react";

import CreatableSelect from "react-select/creatable";

const createOption = (label, value) => ({
    label,
    value,
});

export default ({ defaulOptions, value, setValue }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState(defaulOptions);

    const handleCreate = (inputValue) => {
        setIsLoading(true);
        const newOption = createOption(inputValue, null);
        setIsLoading(false);
        setOptions((prev) => [...prev, newOption]);
        setValue((prev) => [...prev, newOption]);
    };

    return (
        <CreatableSelect
            className="my-creatable"
            classNamePrefix="mycreatable"
            isClearable
            isMulti
            isDisabled={isLoading}
            isLoading={isLoading}
            onChange={setValue}
            onCreateOption={handleCreate}
            options={options}
            value={value}
            styles={{
                control: (provided, state) => ({
                    ...provided,
                    boxShadow: state.isFocused ? "none" : "none",
                    borderColor: state.isFocused ? "#d1d5db" : "#d1d5db",
                    backgroundColor: "transparent", // transparan
                    "&:hover": {
                        borderColor: "#9ca3af",
                    },
                }),
            }}
        />
    );
};

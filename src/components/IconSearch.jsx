/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

const IconSearch = ({ selectedIcon, setSelectedIcon }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [isSearching, setIsSearching] = useState(false); // Track if the user is actively searching

  // Debounce effect to delay filtering
  useEffect(() => {
    if (isSearching) {
      const timer = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
      }, 300); // 300ms debounce delay

      return () => clearTimeout(timer); // Cleanup the timeout on component unmount or when searchTerm changes
    }
  }, [searchTerm, isSearching]);

  // Filter icons based on debounced search term
  const filteredIcons = Object.keys(Icons).filter((icon) =>
    icon.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // Handle the icon selection
  const handleIconClick = (icon) => {
    setSelectedIcon(icon);
    setSearchTerm('');  // Clear search term after selection
    setIsSearching(false);  // Disable search mode
  };

  return (
    <div className="space-y-2">
      {/* Input field to trigger search when clicked */}
      <input
        type="text"
        placeholder="Search for an icon..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsSearching(true)}  // Enable search when input is focused
        className="w-full p-2 border border-gray-300 rounded"
      />
      
      {/* Display icons only if search is active and there are results */}
      {isSearching && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {filteredIcons.length > 0 ? (
            filteredIcons.map((icon) => {
              const IconComponent = Icons[icon];

              // Ensure the component is a valid React component before rendering
              if (typeof IconComponent !== 'function' || !IconComponent.$$typeof) {
                console.warn(`Icon ${icon} is not a valid React component or is not properly exported.`);
                return null; // Skip rendering if not a valid component
              }

              return (
                <div
                  key={icon}
                  role="button"
                  aria-label={`Select ${icon} icon`}
                  className="cursor-pointer hover:text-indigo-600"
                  onClick={() => handleIconClick(icon)} // Handle icon selection
                >
                  <IconComponent className="h-6 w-6" />
                </div>
              );
            })
          ) : (
            <div className="text-gray-500 col-span-4">No icons found</div>
          )}
        </div>
      )}

      {/* Display selected icon */}
      {selectedIcon && !isSearching && (
        <div className="mt-2 text-sm text-gray-700">
          <strong>Selected Icon:</strong> {selectedIcon}
        </div>
      )}
    </div>
  );
};

export default IconSearch;


// /** @jsxImportSource react */
// import React, { useState, useEffect } from 'react';
// import * as Icons from 'lucide-react';

// const IconSearch = ({ selectedIcon, setSelectedIcon }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

//   // Debounce effect to delay filtering
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm);
//     }, 300); // 300ms debounce delay

//     return () => clearTimeout(timer); // Cleanup the timeout on component unmount or when searchTerm changes
//   }, [searchTerm]);

//   // Filter icons based on debounced search term
//   const filteredIcons = Object.keys(Icons).filter((icon) =>
//     icon.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
//   );

//   return (
//     <div className="space-y-2">
//       <input
//         type="text"
//         placeholder="Search for an icon..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full p-2 border border-gray-300 rounded"
//       />
//       <div className="grid grid-cols-4 gap-2">
//         {filteredIcons.map((icon) => {
//           const IconComponent = Icons[icon];

//           // Ensure the component is a valid React component before rendering
//           if (typeof IconComponent !== 'function' || !IconComponent.$$typeof) {
//             console.warn(`Icon ${icon} is not a valid React component or is not properly exported.`);
//             return null; // Skip rendering if not a valid component
//           }

//           return (
//             <div
//               key={icon}
//               role="button"
//               aria-label={`Select ${icon} icon`}
//               className="cursor-pointer hover:text-indigo-600"
//               onClick={() => setSelectedIcon(icon)}
//             >
//               <IconComponent className="h-6 w-6" />
//             </div>
//           );
//         })}
//       </div>
//       {selectedIcon && (
//         <div className="mt-2 text-sm text-gray-700">
//           <strong>Selected Icon:</strong> {selectedIcon}
//         </div>
//       )}
//     </div>
//   );
// };

// export default IconSearch;



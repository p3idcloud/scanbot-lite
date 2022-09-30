// export default function ScannerConfig() {
//     return (
//         <>
//         <section className={`${style.scanner_view}`}>
//             <Col xs={12} sm={6} className="mt-3 flex w-full flex-col">
//             <span className="text-xs text-gray-500">Scan Profile</span>
//             <div className="flex justify-between items-end space-x-2">
//                 <div className=" flex flex-col w-full">
//                 <Listbox
//                     list={listProfileScanner}
//                     selected={profileSelect}
//                     setSelected={setProfileSelect}
//                     itemTitle="name"
//                     onChange={(item) => handleChange("profileSelect", item)}
//                 />
//                 </div>
//             </div>
//             </Col>
//             <Col
//             xs={12}
//             sm={6}
//             className="mt-3 self-end d-flex justify-content-end"
//             >
//             {profileSelect?.id && (
//                 <button
//                 onClick={handleDeleteProfile}
//                 className="py-2 px-4 mx-2 text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 text-sm"
//                 >
//                 Delete
//                 </button>
//             )}
//             {isChange && (
//                 <button
//                 onClick={() => setSaveProfile(true)}
//                 className="py-2 px-4 text-white bg-blue-800 border border-transparent rounded-md hover:bg-blue-600 text-sm"
//                 >
//                 Save as New Profile
//                 </button>
//             )}
//             </Col>
//             <span className="block truncate"></span>
//             {getConfigValues().map((data, i) => (
//             <Col xs={12} sm={6} className="mt-3" key={i}>
//                 {data.current_values && data.current_values.length >= 0 ? (
//                 <div className="text-xs text-gray-500 flex flex-col space-y-1">
//                     <span>{data.labelName}</span>
//                     <button
//                     className="relative text-black w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm"
//                     type="button"
//                     aria-haspopup="true"
//                     aria-expanded="false"
//                     >
//                     <span className="block truncate">
//                         {data.current_values.length > 1 || data.multiple ? (
//                         <ReactTags
//                             tags={data.current_values}
//                             handleDelete={(index) => handleDelete(index, i)}
//                             handleAddition={(tag) => handleAddition(tag, i)}
//                             handleDrag={(tag, currPos, newPos) =>
//                             handleDrag(tag, currPos, newPos, i)
//                             }
//                             delimiters={delimiters}
//                             placeholder={`Add new ${data.labelName}`}
//                         />
//                         ) : (
//                         <span>
//                             {data.current_values[0].tag === "select" ||
//                             !data.current_values[0].tag ? (
//                             <FormGroup>
//                                 <Input
//                                 type="select"
//                                 onChange={(e) =>
//                                     handleChangeTag(e.target.value, i)
//                                 }
//                                 name="select"
//                                 value={data.current_values[0].tagValue}
//                                 >
//                                 {data.possibleValues.map((pv) => (
//                                     <option value={pv.value}>{pv.value}</option>
//                                 ))}
//                                 </Input>
//                             </FormGroup>
//                             ) : (
//                             <>
//                                 <FormGroup>
//                                 <Input
//                                     type="select"
//                                     onChange={(e) =>
//                                     handleChangeTag(e.target.value, i)
//                                     }
//                                     name="select"
//                                     value={data.current_values[0].tagValue}
//                                 >
//                                     {data.possibleValues.map((pv) => (
//                                     <option value={pv.value}>
//                                         {pv.value}
//                                     </option>
//                                     ))}
//                                 </Input>
//                                 </FormGroup>
//                                 <Input
//                                 type="text"
//                                 value={data.current_values[0].text}
//                                 onChange={(e) =>
//                                     setConfigValue(e.target.value, i)
//                                 }
//                                 />
//                             </>
//                             )}
//                         </span>
//                         )}
//                     </span>
//                     </button>
//                 </div>
//                 ) : null}
//             </Col>
//             ))}
//             {(profileSelect?.name !== "default" ||
//             isChange ||
//             profileSelect?.id) && (
//             <Col xs={12} sm={12} className="mt-3 d-flex justify-content-end">
//                 <ProfileScanner
//                 profileSelect={profileSelect}
//                 listScannerSettings={listScannerSettings}
//                 />
//             </Col>
//             )}
//         </section>
//         <div className="flex space-x-4 w-full">
//             <StartCapture statusClaim={statusClaim} />
//         </div>
//         </>
//     )
// }
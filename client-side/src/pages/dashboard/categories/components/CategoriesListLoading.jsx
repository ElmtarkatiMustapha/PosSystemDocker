export function CategoriesListLoading() {
    return (
        <div className="categoriesLoading col-12 containeer-fluid p-0">
            <div className="row m-0 ">
                {/* Current categories */}
                <CategoryItem/>
                <CategoryItem/>
                <CategoryItem/>
                <CategoryItem/>
                <CategoryItem/>
                <CategoryItem/>
                <CategoryItem/>
                <CategoryItem/>
                <CategoryItem/>
                <CategoryItem/>
            </div>
            <div className="row">
                {/* pagination heres */}
                
            </div>
        </div>
    )
}

function CategoryItem() {
    return (
        <div className="col-12 col-lg-6 pt-3 pb-3 ps-1 pe-1 container-fluid">
            <div className="item pt-2 pb-2 ps-2 pe-2 row m-0">
                <div  className="image align-self-center col-3 col-md-2 ps-0 pe-0 pt-2 pb-2 d-inline-block">
                    <div
                        style={{
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            height: "3.5rem",
                            width: "3.5rem",
                            borderRadius: "50px",
                            overflow: "hidden"
                        }}
                        className="bg-image">

                    </div>
                </div>
                <div  className="infos col-8  col-md-3 ps-1 pe-1 pt-2 pb-2 align-self-center d-inline-block">
                    <div  className="title mb-1"></div>
                    <div className="subTitle"></div>
                </div>
                <div  className="statistic align-self-center ps-0 pe-0 pt-2 pb-2 text-start text-md-center  col-7 col-md-4 d-inline-block">
                    <div  className="part p-1 d-inline-block text-center">
                        <div className="title mb-1"></div>
                        <div className="subTitle"></div>
                    </div>
                    <div className="line d-inline-block"></div>
                    <div className="part p-1 d-inline-block text-center">
                        <div className="title mb-1"></div>
                        <div className="subTitle"></div>
                    </div>
                </div>
                <div className="actions col-5 col-md-3 pt-2 pb-2 ps-0 pe-0 align-self-center text-end d-inline-block">
                    <div className="action-box"></div>
                </div>
            </div>
        </div>
    )
}